# AGENTS.md - Workspace Rules

## 🌐 Language & Communication Guidelines
- **Communication Language**: Always converse, explain, and discuss tasks with the user in **Vietnamese** (Tiếng Việt).
- **Codebase & Documentation Language**: Keep all code, variable/function names, code comments, git commit messages, and project documentation strictly in **English** (unless explicitly instructed otherwise for specific user-facing text).

## 🔍 Codebase Exploration & Analysis
- **CodeGraph First**: Whenever analyzing, reading, or navigating multiple lines of code across components or files, always prioritize using **CodeGraph** (`codegraph_explore` MCP tool or `codegraph` CLI) over basic file searches or grep to minimize token usage and get exact symbol call hierarchies.
