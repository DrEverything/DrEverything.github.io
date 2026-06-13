<script lang="ts">
	import * as Alert from "$lib/components/ui/alert/index.js";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import InfoIcon from "@lucide/svelte/icons/info";
	import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import XIcon from "@lucide/svelte/icons/x";
	import { toast as sonnerToast } from "svelte-sonner";

	interface Props {
		closeToast?: () => void;
		message: string;
		description?: string;
		variant?: "default" | "destructive";
		type?: "success" | "error" | "warning" | "info" | "loading";
	}

	let {
		closeToast,
		message,
		description,
		variant = "default",
		type = "info"
	}: Props = $props();
</script>

<Alert.Root {variant} class="w-[356px] shadow-lg relative pr-8">
	{#if type === "success"}
		<CheckCircle2Icon class="text-emerald-500" />
	{:else if type === "error" || variant === "destructive"}
		<AlertCircleIcon class="text-destructive" />
	{:else if type === "warning"}
		<TriangleAlertIcon class="text-amber-500" />
	{:else if type === "loading"}
		<LoaderCircleIcon class="animate-spin text-muted-foreground" />
	{:else}
		<InfoIcon class="text-blue-500" />
	{/if}

	{#if description}
		<Alert.Title>{message}</Alert.Title>
		<Alert.Description>{description}</Alert.Description>
	{:else}
		<Alert.Title>{message}</Alert.Title>
	{/if}

	{#if type !== "loading"}
		<button
			onclick={() => closeToast?.()}
			class="absolute right-2.5 top-2.5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
			aria-label="Dismiss toast"
		>
			<XIcon class="size-4 text-muted-foreground" />
		</button>
	{/if}
</Alert.Root>
