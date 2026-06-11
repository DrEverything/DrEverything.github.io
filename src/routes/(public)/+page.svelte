<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,400;1,9..144,500&display=swap"
		rel="stylesheet"
	/>
	<title>Monada — your baseline, not the average</title>
	<meta
		name="description"
		content="Standard bloodwork compares you to strangers. Monada compares you to you, and watches what changes over time."
	/>
</svelte:head>

<div class="min-h-screen bg-background text-foreground antialiased">
	<!-- HEADER: identity only, no navigation, no second action -->
	<header class="border-b border-border/60">
		<div class="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-8">
			<span class="font-mono text-[13px] font-medium tracking-[0.35em]"
				>MONADA<span class="text-primary">.</span></span
			>
			<span class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
				>Personal biological intelligence</span
			>
		</div>
	</header>

	<main class="mx-auto max-w-[1040px] px-8">
		<!-- HERO -->
		<section class="pb-16 pt-[88px]">
			<p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
				Your baseline · not the average
			</p>
			<h1 class="serif mt-6 max-w-[14ch] text-balance leading-[1.02] tracking-[-0.02em]">
				Your body is not a <em class="text-primary">population.</em>
			</h1>
			<p class="mt-7 max-w-[52ch] text-[19px] text-muted-foreground">
				Standard bloodwork compares you to strangers and calls you normal. Monada compares you to
				you, and watches what changes over time.
			</p>

			<!-- The only action on the page -->
			<Button href="/health" size="lg" class="mt-9 h-auto gap-2.5 px-6 py-3.5 text-[15px]">
				Start your baseline
				<svg
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</Button>

			<!-- SIGNATURE: a real personal biomarker dropping 52% while never leaving the "normal" band -->
			<figure
				class="relative mt-16 overflow-hidden rounded-2xl border border-border bg-card/40 px-6 pb-4 pt-6"
			>
				<div
					class="pointer-events-none absolute -bottom-44 -right-28 size-[420px] rounded-full"
					style="background: radial-gradient(circle, color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%)"
				></div>
				<figcaption class="mb-2 flex items-baseline justify-between font-mono">
					<span class="text-[12px] uppercase tracking-[0.18em] text-muted-foreground"
						>Biomarker · 12 weeks</span
					>
					<span class="text-[12px] text-primary">Δ −52% · inside range · not flagged</span>
				</figcaption>

				<svg
					viewBox="0 0 900 320"
					width="100%"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label="A personal biomarker drops 52 percent over twelve weeks while staying inside the population normal range, so standard screening never flags it."
				>
					<!-- population normal band -->
					<rect x="70" y="110" width="800" height="140" class="fill-foreground/[0.06]" />
					<line x1="70" y1="110" x2="870" y2="110" class="stroke-border" stroke-dasharray="3 4" />
					<line x1="70" y1="250" x2="870" y2="250" class="stroke-border" stroke-dasharray="3 4" />
					<text x="78" y="103" class="fill-muted-foreground font-mono text-[11px] tracking-[1px]"
						>POPULATION NORMAL RANGE · HIGH</text
					>
					<text x="78" y="268" class="fill-muted-foreground font-mono text-[11px] tracking-[1px]"
						>LOW</text
					>

					<!-- the user's own baseline reference -->
					<line
						x1="70"
						y1="145"
						x2="870"
						y2="145"
						class="stroke-primary/30"
						stroke-dasharray="2 6"
					/>
					<text
						x="788"
						y="140"
						class="fill-primary/70 font-mono text-[11px] tracking-[1px]"
						text-anchor="end">YOUR BASELINE</text
					>

					<!-- YOU: the trace draws itself on load -->
					<path
						class="trace stroke-primary"
						d="M90,145 L156,145 L223,149 L289,145 L356,159 L422,170 L489,180 L555,194 L622,208 L688,219 L755,229 L821,236"
						fill="none"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						pathLength="1"
					/>
					<g class="points fill-primary">
						<circle cx="90" cy="145" r="2.5" /><circle cx="156" cy="145" r="2.5" /><circle
							cx="223"
							cy="149"
							r="2.5"
						/><circle cx="289" cy="145" r="2.5" /><circle cx="356" cy="159" r="2.5" /><circle
							cx="422"
							cy="170"
							r="2.5"
						/><circle cx="489" cy="180" r="2.5" /><circle cx="555" cy="194" r="2.5" /><circle
							cx="622"
							cy="208"
							r="2.5"
						/><circle cx="688" cy="219" r="2.5" /><circle cx="755" cy="229" r="2.5" />
					</g>
					<circle class="endpoint fill-primary" cx="821" cy="236" r="6" />
					<circle class="endpoint stroke-primary/40" cx="821" cy="236" r="11" fill="none" />
					<text x="120" y="135" class="fill-foreground font-mono text-[12px] tracking-[1px]">YOU</text>
				</svg>
			</figure>
		</section>

		<!-- THE BLIND SPOT -->
		<section class="border-t border-border/60 py-24">
			<p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
				The blind spot
			</p>
			<h2 class="serif mt-4 max-w-[20ch] leading-[1.08] tracking-[-0.02em]">
				The healthier you are, the better your disease hides.
			</h2>
			<p class="mt-5 max-w-[60ch] text-[18px] text-muted-foreground">
				Two people lose the same amount. Only the one already sitting at the edge of the range gets
				caught. The fit person has to lose far more before the system sees anything at all, and by
				then it has been growing for longer.
			</p>

			<div class="mt-12 grid gap-4.5">
				<!-- sedentary: identical drop crosses below the band -> flagged -->
				<div
					class="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border px-5 py-5 sm:grid-cols-[160px_1fr_150px]"
				>
					<div class="text-[15px]">
						Sedentary patient
						<small class="mt-1 block font-mono text-[12.5px] tracking-[0.04em] text-muted-foreground"
							>13 → 8 · Δ −5</small
						>
					</div>
					<svg viewBox="0 0 520 96" width="100%" height="84" preserveAspectRatio="none">
						<rect x="0" y="20" width="520" height="44" class="fill-foreground/[0.07]" />
						<line
							x1="0"
							y1="64"
							x2="520"
							y2="64"
							class="stroke-muted-foreground/45"
							stroke-dasharray="3 4"
						/>
						<text x="6" y="14" class="fill-muted-foreground font-mono text-[9.5px] tracking-[1px]"
							>NORMAL RANGE</text
						>
						<text x="455" y="80" class="fill-primary font-mono text-[9.5px] tracking-[1px]"
							>↓ BELOW</text
						>
						<line
							x1="70"
							y1="52"
							x2="310"
							y2="82"
							class="stroke-primary"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
						<circle cx="70" cy="52" r="3.5" class="fill-primary" />
						<circle cx="310" cy="82" r="5" class="fill-primary" />
					</svg>
					<div class="text-left font-mono text-[13px] tracking-[0.04em] text-primary sm:text-right">
						▶ FLAGGED · TREATED
					</div>
				</div>

				<!-- optimized: identical drop stays inside the band -> dismissed -->
				<div
					class="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border px-5 py-5 sm:grid-cols-[160px_1fr_150px]"
				>
					<div class="text-[15px]">
						Optimized patient
						<small class="mt-1 block font-mono text-[12.5px] tracking-[0.04em] text-muted-foreground"
							>25 → 20 · Δ −5</small
						>
					</div>
					<svg viewBox="0 0 520 96" width="100%" height="84" preserveAspectRatio="none">
						<rect x="0" y="20" width="520" height="44" class="fill-foreground/[0.07]" />
						<line
							x1="0"
							y1="64"
							x2="520"
							y2="64"
							class="stroke-muted-foreground/45"
							stroke-dasharray="3 4"
						/>
						<text x="6" y="14" class="fill-muted-foreground font-mono text-[9.5px] tracking-[1px]"
							>NORMAL RANGE</text
						>
						<text x="430" y="42" class="fill-muted-foreground font-mono text-[9.5px] tracking-[1px]"
							>STILL INSIDE</text
						>
						<line
							x1="70"
							y1="26"
							x2="310"
							y2="56"
							class="stroke-primary"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
						<circle cx="70" cy="26" r="3.5" class="fill-primary" />
						<circle cx="310" cy="56" r="5" class="fill-primary" />
					</svg>
					<div
						class="text-left font-mono text-[13px] tracking-[0.04em] text-muted-foreground sm:text-right"
					>
						— "NORMAL" · DISMISSED
					</div>
				</div>
			</div>
		</section>

		<!-- WHAT WE MAKE VISIBLE -->
		<section class="border-t border-border/60 py-24">
			<p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
				What we make visible
			</p>
			<h2 class="serif mt-4 leading-[1.08] tracking-[-0.02em]">
				Three readings, all measured against you.
			</h2>

			<div class="mt-13 grid gap-4.5 md:grid-cols-3">
				<div class="flex min-h-[230px] flex-col rounded-2xl border border-border px-5 py-6">
					<span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Blood</span>
					<h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em]">Your history, not theirs</h3>
					<p class="mt-2.5 text-[14.5px] leading-[1.55] text-muted-foreground">
						Every biomarker is plotted against your own past results. A change the population range
						will never flag is obvious the moment it bends away from your line.
					</p>
					<div class="mt-auto pt-4.5">
						<svg viewBox="0 0 240 56" width="100%" height="56">
							<rect x="0" y="14" width="240" height="28" class="fill-foreground/[0.06]" />
							<polyline
								points="6,28 40,27 74,29 108,26 142,30 176,40 210,49 234,52"
								fill="none"
								class="stroke-primary"
								stroke-width="2"
								stroke-linecap="round"
							/>
							<circle cx="234" cy="52" r="3.5" class="fill-primary" />
						</svg>
					</div>
				</div>

				<div class="flex min-h-[230px] flex-col rounded-2xl border border-border px-5 py-6">
					<span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Training</span
					>
					<h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em]">See the wall early</h3>
					<p class="mt-2.5 text-[14.5px] leading-[1.55] text-muted-foreground">
						We project where your current training stops paying off, before you hit it, so you change
						the stimulus in time instead of grinding months into a plateau.
					</p>
					<div class="mt-auto pt-4.5">
						<svg viewBox="0 0 240 56" width="100%" height="56">
							<path
								d="M6,50 C60,50 120,18 150,16 C190,13 220,13 234,13"
								fill="none"
								class="stroke-primary"
								stroke-width="2"
								stroke-linecap="round"
							/>
							<line
								x1="150"
								y1="8"
								x2="150"
								y2="52"
								class="stroke-primary/40"
								stroke-dasharray="2 4"
							/>
							<circle cx="150" cy="16" r="3.5" class="fill-primary" />
						</svg>
					</div>
				</div>

				<div class="flex min-h-[230px] flex-col rounded-2xl border border-border px-5 py-6">
					<span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary"
						>Nutrition</span
					>
					<h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em]">What you absorb</h3>
					<p class="mt-2.5 text-[14.5px] leading-[1.55] text-muted-foreground">
						Tracked on what your body actually takes up, not what the label claims, with an honest
						projection of where your current eating is taking you.
					</p>
					<div class="mt-auto pt-4.5">
						<svg viewBox="0 0 240 56" width="100%" height="56">
							<rect x="6" y="14" width="150" height="12" rx="3" class="fill-muted" />
							<rect x="6" y="14" width="96" height="12" rx="3" class="fill-primary" />
							<text x="6" y="46" class="fill-muted-foreground font-mono text-[10px] tracking-[1px]"
								>RAW 150g · ABSORBED 96g</text
							>
						</svg>
					</div>
				</div>
			</div>
		</section>

		<!-- HOW IT WORKS -->
		<section class="border-t border-border/60 py-24">
			<p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
				How it works
			</p>
			<h2 class="serif mt-4 leading-[1.08] tracking-[-0.02em]">
				Four steps. Then it runs on your data.
			</h2>
			<ol class="mt-13 border-t border-border/60">
				<li
					class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr]"
				>
					<span class="font-mono text-[13px] tracking-[0.1em] text-primary">01</span>
					<span class="serif text-[19px] tracking-[-0.01em]">Draw</span>
					<span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
						>At home, or at the nearest partner lab. You choose.</span
					>
				</li>
				<li
					class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr]"
				>
					<span class="font-mono text-[13px] tracking-[0.1em] text-primary">02</span>
					<span class="serif text-[19px] tracking-[-0.01em]">Baseline</span>
					<span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
						>Your personal reference is built from your own results, not a population chart.</span
					>
				</li>
				<li
					class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr]"
				>
					<span class="font-mono text-[13px] tracking-[0.1em] text-primary">03</span>
					<span class="serif text-[19px] tracking-[-0.01em]">Track</span>
					<span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
						>Every new result is plotted against your history, so deviation shows immediately.</span
					>
				</li>
				<li
					class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr]"
				>
					<span class="font-mono text-[13px] tracking-[0.1em] text-primary">04</span>
					<span class="serif text-[19px] tracking-[-0.01em]">Optimize</span>
					<span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
						>Training and nutrition adjust to what your biology actually shows, not guesswork.</span
					>
				</li>
			</ol>
		</section>
	</main>

	<!-- CLOSE -->
	<section class="border-t border-border/60 px-8 pb-32 pt-30 text-center">
		<h2 class="serif mx-auto max-w-[18ch] leading-[1.08] tracking-[-0.02em]">
			Medicine built on averages cannot see you. <em class="text-primary">This can.</em>
		</h2>
		<p class="mt-6 font-mono text-[15px] text-muted-foreground">
			Your baseline is the only reference that was ever about you.
		</p>
	</section>

	<footer class="border-t border-border/60">
		<div
			class="mx-auto flex h-[72px] max-w-[1040px] items-center justify-between px-8 font-mono text-[12px] tracking-[0.04em] text-muted-foreground"
		>
			<span>MONADA<span class="text-primary">.</span>FOUNDATION</span>
			<span>HELSINKI · TALLINN</span>
		</div>
	</footer>
</div>

<style>
	/* Display face: humane precision against the machine-readout mono. Used only for statements. */
	.serif {
		font-family: "Fraunces", Georgia, "Times New Roman", serif;
		font-weight: 400;
		letter-spacing: -0.01em;
	}
	.serif em {
		font-style: italic;
	}

	/* Fluid display scale */
	h1.serif {
		font-size: clamp(40px, 6.2vw, 76px);
	}
	h2.serif {
		font-size: clamp(28px, 3.6vw, 44px);
	}
	section.text-center h2.serif {
		font-size: clamp(30px, 4.4vw, 52px);
	}

	/* tailwind has no 4.5/13/30 spacing steps by default; define the few used above */
	:global(.gap-4\.5) {
		gap: 1.125rem;
	}
	:global(.pt-4\.5) {
		padding-top: 1.125rem;
	}
	:global(.mt-13) {
		margin-top: 3.25rem;
	}
	:global(.pt-30) {
		padding-top: 7.5rem;
	}

	/* The one signature motion: the YOU trace draws in on load. Everything else is static. */
	.trace {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.trace {
			stroke-dashoffset: 0;
			animation: none;
		}
	}
</style>
