export const validateEmail = (email: string): boolean => {
	// Regular expression for basic email validation
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
};
