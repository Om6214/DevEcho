import { Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";

// A middleware that listens for fulfilled/rejected actions globally
export const toastMiddleware: Middleware = () => (next) => (action: any) => {
    // Show success toast if action is fulfilled and has message
    if (action.type.endsWith("/fulfilled")) {
        const message =
            action.payload?.message ||
            action.payload?.msg ||
            action.meta?.arg?.successMessage;

        if (message) {
            toast.success(message);
        }
    }

    // Show error toast if action is rejected and has payload message
    if (action.type.endsWith("/rejected")) {
        const errorMessage =
            action.payload ||
            action.error?.message ||
            "Something went wrong";

        toast.error(errorMessage);
    }

    return next(action);
};
