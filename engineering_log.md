The log should be committed publicly, and part of the project.

## Edit In Place

## Draft Persistence

## Clear Button

## Parser + Specimen

## Recovery Crisis

## Logs

- Replacements are strings and the number comes later. The table ges swapped in and the confirm the replaced line

- stage-guarantees-are-downstream-assumptions, channel-not-key ambiguity (your win, write it as one), dot-strip deferred with the decimal reason, the combo-test distinction, and the arc-summary itself with the SLM tail's specimen list soup-can, salt-to-taste, dozen, multi-line — each with its waiting reason

## OCR build

the final version:
For receipts that populate the pantry, OCR extracts the data, and the SLM parses it to update the pantry. 
The final product is that OCR gets the recipe photos, and each line goes through the parser; if that fails, it goes to the SLM. 

what we are building now is the OCR to funnel the data to the parser. 

we will build the slm later
failed lines get refused and logged and that log is the slm tuition this version ships without it

V1: recipe-card photos. Receipts wait for the SLM; the SLM waits for refusal logs; the logs start when this ships.
Ladder: screenshot tonight (pipeline proof) → phone-photo of a page (rung 1 proper) → imperfect capture → neat hand; creased-cursive is the named ceiling.
No pre-filter: refusals + pantry-flags classify for free.
Engine: one open-source Python OCR, backend, shootout next session against your specimen.
Seam: backend returns raw lines; frontend loops the parser it already owns.

9/1/2026
 - ## to hide wait times behind paddleOCR wait time.  asynchronous background processing with a progressive-reveal UI is the answer

 engine paddle ocr chosen based of rung 1 

 async design to make latency issues. 
 

 The wiring plan is complete. Ledger, in full:

Bullet-strip rule — Normalize, leading-junk regex anchored to line start, evidence-grown character class, test-first
Flow — v1 single-card: trigger on recipes page → honest spinner with expectation sentence → straight into the draft list; A′ multi-card queued behind Render concurrency evidence
Failure — "couldn't read that photo — try a clearer shot?" + dropdowns already on screen as fallback
Landing — three-tier straight-in: parsed clean, warned flagged, refused in a strip below with raw text + hand-fix; refusals logged
Deferred, on their original terms — classifier, receipts, async multi-card

To run FASTAPI

use uvicorn main:app --reload

then the http://127.0.0.1:8000/docs


- Memory verdict: idle ~428 MB, peak observed ~550 MB during chili inference (Windows, Task Manager). Free tier (512 MB) confirmed unavailable — over ceiling on first request. Starter paid tier (~2 GB) clears requirement ~4x. Decision on paying vs. alternatives: after vacation, with the wiring slice as the priority either way

files are read and return lines
.env to make it so on my local computer it runs off uvicorn and for other users it uses the online ocr. 

guards are scheduled for next slice
9/14/2026
guard are in place three failure point verified, multiple images parsed some taking up to 2 minutes to parse


# gotta add a scaling function to allow user to project how much ingredients they need to purchase to satisfy the recipe for x number of users. 

# function should take what already exist, convert all to grams, scale and then convert it back to initial volume of measurement and round to ceiling whole number, and account for waste and things of that nature

9/15/2026

The ingredient parser with guards is live on vercel and the vercel website connects to render and all is well with the cosmos

# feature/ocrFeedback
completed
add revert for the pictures if user wants it

# use vision slm to parse images, the add function is added but when added it should automatically disappear for that ingredient

today's rulings and catches: push-mirrors-manual, the live-check design (and why your delete-requirement forced it over a flag), the double-click receipt, ingredientID's one-letter lesson.