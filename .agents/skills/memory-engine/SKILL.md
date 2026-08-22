---
name: memory-engine
description: Interfaces with the Local Multimodal Project Memory Engine. Translates natural language into database retrievals, logs session summaries, and manages project context.
---
# Memory Engine: Natural Language Command Translator

When the user invokes this skill, analyze their natural language input and map it strictly to one of the following deterministic actions. **Do not guess; execute the corresponding terminal command.**

**1. Retrieval Intent**
- *Triggers:* "Where were we on...", "What is the last thing we did?", "Pull memory for..."
- *Action:* Extract the core search subject. Execute the shell command: `npm run memory -- search "<subject>"`
- *Response:* Read the stdout context and answer the user's question seamlessly based on the retrieved memory.

**2. Logging & Idea Intent**
- *Triggers:* "Log this plan", "Save this idea to memory", "Remember that..."
- *Action:* Format the concept into a clean markdown string. Execute the shell command: `npm run memory -- ingest-text "<formatted_string>"`
- *Response:* Confirm ingestion and provide the user with the generated embedding ID if available.

**3. Session Handoff & Summarization Intent**
- *Triggers:* "Summarize session and log to memory", "We are done, save state"
- *Action:* Analyze the current active conversation trajectory. Generate a comprehensive "Session Handoff" summary detailing decisions made, files altered, and next steps. Execute the shell command: `npm run memory -- ingest-text "<session_handoff_summary>"`
- *Response:* Print the summary to the terminal and confirm it has been successfully encoded into the semantic graph.
