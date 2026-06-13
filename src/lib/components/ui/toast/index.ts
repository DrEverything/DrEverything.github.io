import { toast as sonnerToast } from "svelte-sonner";
import AlertToast from "./alert-toast.svelte";

const toastOptions = {
	unstyled: true,
	class: "!border-none !bg-transparent !p-0 !shadow-none"
};

export const toast = {
	custom: sonnerToast.custom,
	dismiss: sonnerToast.dismiss,
	
	loading: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "loading",
				variant: "default",
				...restOptions?.componentProps
			}
		});
	},

	success: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "success",
				variant: "default",
				...restOptions?.componentProps
			}
		});
	},

	error: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "error",
				variant: "destructive",
				...restOptions?.componentProps
			}
		});
	},

	warning: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "warning",
				variant: "default",
				...restOptions?.componentProps
			}
		});
	},

	info: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "info",
				variant: "default",
				...restOptions?.componentProps
			}
		});
	},

	message: (message: string, options?: any) => {
		const { description, ...restOptions } = options || {};
		return sonnerToast.custom(AlertToast, {
			...toastOptions,
			...restOptions,
			componentProps: {
				message,
				description,
				type: "info",
				variant: "default",
				...restOptions?.componentProps
			}
		});
	},

	promise: <T>(
		promise: Promise<T> | (() => Promise<T>),
		options: {
			loading: string;
			success: string | ((data: T) => string);
			error: string | ((error: any) => string);
			description?: string;
		}
	) => {
		const actualPromise = typeof promise === "function" ? promise() : promise;
		const id = sonnerToast.custom(AlertToast, {
			...toastOptions,
			duration: Infinity,
			componentProps: {
				message: options.loading,
				description: options.description,
				type: "loading",
				variant: "default"
			}
		});

		actualPromise
			.then((data) => {
				const successMsg = typeof options.success === "function" ? options.success(data) : options.success;
				sonnerToast.custom(AlertToast, {
					id,
					...toastOptions,
					duration: 4000,
					componentProps: {
						message: successMsg,
						description: options.description,
						type: "success",
						variant: "default"
					}
				});
			})
			.catch((err) => {
				const errorMsg = typeof options.error === "function" ? options.error(err) : options.error;
				sonnerToast.custom(AlertToast, {
					id,
					...toastOptions,
					duration: 5000,
					componentProps: {
						message: errorMsg,
						description: options.description,
						type: "error",
						variant: "destructive"
					}
				});
			});

		return id;
	}
};
