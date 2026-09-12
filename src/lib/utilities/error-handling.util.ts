export function makeErrorReadable(error: any) {
	if (error?.message?.includes('Failed to retrieve ID token')) {
		return 'Authorization failed. Please log in again.';
	}

	if (error?.status === 401) {
		return 'Authorization failed. Please log in again.';
	}

	if (error?.message?.includes('failure during parsing')) {
		return 'Invalid task output. Please try again.';
	}

	if (error?.error) {
		console.error(error);
		return error?.error?.message
	}

	if (error?.message) {
		console.error(error);
		console.warn('Error message is unhandled', error);
		return error.message;
	}

	return error;
}
