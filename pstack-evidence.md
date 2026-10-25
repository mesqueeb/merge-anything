# pstack evidence — merge-anything #48

## Principles
- fix-root-causes: isPlainObject rejects null-prototype bags; wrap with isMergeableObject.
- Laziness Protocol: local helper only; no is-what fork.
- Prove It Works: vitest regression for Object.create(null) merge both directions + nested.
- Read poteto-mode SKILL.md this session.
