# Copilot Instructions

Canonical agent instructions and project rules live in /CLAUDE.md.
Project map, file directory, and architectural decisions live in /AGENTS.md.
All API contracts and shared types live in /api-contracts/ (start with /api-contracts/index.md; cross-cutting concerns in /api-contracts/shared.md).
Read all three before starting any task.

## Mandatory Post-Task Protocol

After any task that creates or deletes a file, renames something, or makes an
architectural decision, update AGENTS.md before considering the task done:
1. Add or remove the file from the directory map with a one-line purpose
2. Append any architectural decision to ## Architectural Decisions
3. Add a one-line entry to ## Recent Changes at the top (format: YYYY-MM-DD — what changed)
