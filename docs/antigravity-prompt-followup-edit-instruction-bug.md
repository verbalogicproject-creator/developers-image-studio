# Follow-up for Antigravity — edit mode silently reuses stale generate-mode text

Copy everything below into Antigravity, working in `/root/image-studio`.

---

Found a real bug in Edit/Inpaint mode, not a labeling problem — a field-reuse
trap. `rawPrompt` is the ONLY prompt field in the whole app
(`components/StudioTab.tsx`), used for two different things depending on
`editMode`:

- **generate**: the subject concept
- **edit**: the modification instruction for the masked region

The only thing that changes between modes is the textarea's placeholder text
(`StudioTab.tsx` ~line 465: `"Describe the exact modifications for the masked
region..."`). The underlying `rawPrompt` value is never reset when
`editMode` changes.

**Reproduced it directly:** generate a scene, switch to Edit mode, and the
textarea still shows the old subject-concept text under the new "INPAINTING /
MODIFICATION INSTRUCTION" label. If a user doesn't notice and manually clear
it, Gemini receives the *original scene description* as the edit instruction
— not an edit instruction at all — and `compiledPrompt`'s
`<inpainting_edit_directive>` block ends up paired with meaningless input.
Nothing errors. It just silently submits the wrong thing.

## The fix

1. Split into two real fields, not one field with two placeholders:
   - `subjectConcept: string` — generate mode (rename from `rawPrompt` if you
     want, or keep `rawPrompt` as this one for minimal diff)
   - `editInstruction: string` — edit mode, its own piece of state
2. In `StudioTab.tsx`, bind the textarea's `value` to whichever field matches
   the current `editMode`, not to one shared variable.
3. When `setEditMode("edit")` fires, do NOT carry over `subjectConcept`'s
   text into `editInstruction` — start it empty, so there is nothing stale to
   accidentally submit.
4. Update `compileStudioPrompt` (`lib/compiler.ts`) — `<inpainting_edit_directive>`
   currently only says "perform precise photorealistic modification," with
   no reference to what the modification actually is. It should read the new
   `editInstruction` field explicitly:
   ```
   <inpainting_edit_directive>
     Perform this exact modification on the masked region of the provided
     reference image: "${editInstruction.trim()}"
     Blend seamless natural lighting, preserve physical contact shadows outside
     the masked region, and maintain consistent optical resolution across
     edited regions.
   </inpainting_edit_directive>
   ```
5. Validation: `handleGenerate()` already blocks edit mode without a
   `baseImage` (~line 159). Add the matching check for `editInstruction`
   being empty before submitting an edit — same pattern, same place.

## What's already correct — don't touch

`labelSection` (the `packaging_typography` block) is built unconditionally
and already flows into edit-mode prompts correctly — a `full`-labelMode
directive does carry through into an inpaint, which is the right behavior for
using edit mode to fix a bad label. That part works. This fix is only about
`rawPrompt`/`editInstruction` field separation.

## Report back

Confirm with a real edit-mode generation: set a `subjectConcept`, switch to
edit mode, upload a base image, and verify the textarea is genuinely empty
before you type the edit instruction — not just relabeled.
