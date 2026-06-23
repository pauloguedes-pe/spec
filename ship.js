export const meta = {
  name: 'ship',
  description: 'Build from spec, review against spec, fix failures, repeat until approved',
  phases: [
    { title: 'Setup' },
    { title: 'Build' },
    { title: 'Review' },
  ]
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    failures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirement: { type: 'string' },
          problem: { type: 'string' },
          location: { type: 'string' },
          fix: { type: 'string' }
        },
        required: ['requirement', 'problem', 'fix']
      }
    },
    passed: { type: 'array', items: { type: 'string' } }
  },
  required: ['approved', 'failures', 'passed']
}

const specName = typeof args === 'string' ? args.replace(/\.md$/, '') : null

if (!specName) {
  log('Erro: informe o nome da spec. Exemplo: /ship meu-recurso')
  return { error: 'spec name required' }
}

const specPath = `specs/${specName}.md`

const specContent = await agent(
  `Read the file at path "${specPath}" and return its complete contents verbatim. If the file does not exist, return exactly the string: FILE_NOT_FOUND`,
  { label: 'ler spec', phase: 'Setup' }
)

if (!specContent || specContent.trim() === 'FILE_NOT_FOUND') {
  log(`Erro: spec não encontrada em ${specPath}`)
  return { error: `spec not found: ${specPath}` }
}

log(`Spec carregada: ${specPath}`)

let approved = false
let iteration = 0
let corrections = null
const history = []

while (!approved && iteration < 5) {
  iteration++
  log(`— Iteração ${iteration}/5 —`)

  const buildPrompt = corrections
    ? `You are applying corrections to a codebase based on a failed review.

SPEC FILE: ${specPath}
SPEC CONTENT:
${specContent}

CORRECTIONS FROM LAST REVIEW (implement ONLY these, touch nothing else):
${corrections}

Rules:
- Implement exactly and only the listed corrections
- Do not change any code not mentioned in the corrections
- Do not add features beyond what the spec describes`
    : `You are building a feature from a specification. Read the spec carefully and implement exactly what it describes.

SPEC FILE: ${specPath}
SPEC CONTENT:
${specContent}

Rules:
- Build ONLY what the spec explicitly describes
- Do not add features, validations, or refactors beyond the spec
- Do not invent requirements not written in the spec
- If something is ambiguous, make the minimal reasonable assumption`

  await agent(buildPrompt, { label: `build ${iteration}`, phase: 'Build' })

  const reviewResult = await agent(
    `You are reviewing a codebase implementation against its specification. Be strict — approve only if ALL requirements and ALL "definition of done" items are fully met.

SPEC FILE: ${specPath}
SPEC CONTENT:
${specContent}

For each requirement and "definition of done" item:
1. Find the corresponding implementation in the code
2. Verify the behavior matches exactly what is described
3. Check each edge case listed in the spec

Return structured output.`,
    { label: `review ${iteration}`, phase: 'Review', schema: REVIEW_SCHEMA }
  )

  approved = reviewResult.approved
  history.push({ iteration, approved, failures: reviewResult.failures.length })

  if (!approved && reviewResult.failures.length > 0) {
    corrections = reviewResult.failures
      .map((f, i) => `[${i + 1}] Requisito: "${f.requirement}"\nProblema: ${f.problem}\nLocalização: ${f.location || '—'}\nCorreção necessária: ${f.fix}`)
      .join('\n\n')
    log(`Reprovado — ${reviewResult.failures.length} falha(s). Corrigindo...`)
  } else if (!approved) {
    log('Reprovado sem falhas detalhadas. Encerrando loop.')
    break
  }
}

return {
  approved,
  iterations: iteration,
  spec: specPath,
  history
}
