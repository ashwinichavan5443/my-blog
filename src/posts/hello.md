---
title: "Template: how these writeups are structured"
date: 2026-09-09
summary: The shape every project writeup on this site follows, and what each field in the margin means.
# Optional. Only fill this in with a figure you actually measured.
result: null
# Optional. Screen recording for this post — rendered under the title.
# Use an absolute URL; video files never live in this repo.
video: null
poster: null
videoCaption: null
# Optional. YouTube video ID only, used when `video` is empty.
youtube: null
# Optional. Link to the repo for the project.
repo: null
draft: true
---

This file is a template. Copy it, rename it, set `draft: false`, and it appears on
the home page ordered by date. Delete this one once you have two real posts.

## Frontmatter fields

`title`, `date` and `summary` are required. `summary` is the one line that shows in
the index, so write it as the claim rather than a teaser.

`result` prints in the left margin in oxblood, and it exists for one purpose: a
figure you measured yourself. Something like `62% → 98% valid` or `₹0.71 → ₹0.06
per doc`. Leave it `null` when there is no such number. An empty margin is better
than a decorative one.

`repo` prints a link to the code. A writeup without a repo is an opinion.

`video` is the post's demo recording. Set it and the layout drops the player under
the title and adds a "Demo" link to the margin — no HTML needed. Set `poster` too,
or the player renders as a black rectangle until someone presses play. Use `youtube`
instead for narrated walkthroughs past a few minutes; that field takes the video ID,
not the full URL.

## The section order

Keep the same five sections in every project post, so a returning reader knows
where to look.

**The problem.** What the system has to do, and why the obvious approach is
expensive or unreliable. Two paragraphs at most.

**The architecture as built.** Only components that actually ran. Describe the data
flow in order. Where a decision could have gone another way, say why it went this
way.

**What it measures.** The eval set, its size, and how ground truth was established.
Then the table.

| Approach | Valid first try | p95 latency | Cost / 1k |
| --- | --- | --- | --- |
| Frontier API | — | — | — |
| Open weights, self-hosted | — | — | — |
| Fine-tuned small model | — | — | — |

State the hardware and the token lengths under the table. A throughput number
without those conditions attached is not a measurement.

**Where it broke.** The most valuable section and the one almost nobody writes.
Name the failure, what saturated, and at what point.

**What I would add for production.** Four or five specific lines, each traceable to
something in the build above. Mark anything you have not tried as untried.

## Conventions

Code blocks use fenced markdown and get syntax highlighting:

```python
class Task(BaseModel):
    id: str
    title: str
    skills: list[str]
    estimate_hours: float
    depends_on: list[str] = []
```

Tables are set in tabular figures and right-aligned after the first column, so
digits line up down the page. Use them for measurements, not for prose.

## Embedding a recording

Markdown accepts raw HTML, so no plugin is needed. Copy one of these three.

The post's main recording goes in frontmatter, not the body. These snippets are for
*additional* clips inside a section.

**Short silent clip** — the default for demos under about 60 seconds. Video files
live on R2, never in this repo.

```html
<figure>
  <video controls muted loop playsinline preload="metadata"
         poster="https://media.YOURDOMAIN.com/clips/schema-retry.jpg"
         src="https://media.YOURDOMAIN.com/clips/schema-retry.mp4"></video>
  <figcaption>
    Validation rejects the fourth document, feeds the error back, and the retry
    lands. Recorded at 1280×720, no audio.
  </figcaption>
</figure>
```

**Long narrated walkthrough** — anything past a few minutes goes to YouTube.

```html
<div class="embed">
  <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
          title="Walkthrough: extraction pipeline, stage by stage"
          loading="lazy" allowfullscreen></iframe>
</div>
```

**Terminal session** — use asciinema instead of video. The text stays selectable
and the file is a few kilobytes.

```html
<div class="cast">
  <script src="https://asciinema.org/a/CAST_ID.js" id="asciicast-CAST_ID" async></script>
</div>
```

Always describe in prose what the recording shows. A reader skimming on a phone
will not press play, and search engines cannot watch.
