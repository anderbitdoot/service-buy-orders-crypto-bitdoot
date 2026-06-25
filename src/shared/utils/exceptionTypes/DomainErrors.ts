export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainError';
    }
}

export class InvalidAuthenticationError extends Error {
    constructor() {
        super(`Invalid authentication token`);
        this.name = 'InvalidAuthenticationError';
    }
}

export class InvalidConfirmPasswordError extends Error {
    constructor() {
        super(`Invalid confirm password`);
        this.name = 'InvalidConfirmPasswordError';
    }
}

export class InvalidPhoneError extends DomainError {
    constructor(phone: string) {
        super(`Invalid phone number: ${phone}`);
        this.name = 'InvalidPhoneError';
    }
}

export class OtpExpiredError extends DomainError {
    constructor(message?: string) {
        super(message || ' OTP has expired');
        this.name = 'OtpExpiredError';
    }
}

export class InvalidParametersError extends DomainError {
    constructor(params: string) {
        super(`Invalid parameters: ${params}`);
        this.name = 'InvalidParametersError';
    }
}

export class OtpNotFoundError extends DomainError {
    constructor(target: string) {
        super(`OTP not found for: ${target}`);
        this.name = 'OtpNotFoundError';
    }
}

export class InvalidOtpError extends DomainError {
    constructor(message?: string) {
        super(message || 'Invalid OTP code');
        this.name = 'InvalidOtpError';
    }
} 

export class RateLimitError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'RateLimitError';
    }
}

export class MaxAttemptsError extends DomainError {
    constructor(message?: string) {
        super(message || 'Maximum verification attempts exceeded');
        this.name = 'MaxAttemptsError';
    }
}

export class NotCompletedOnboardingError extends Error {
    constructor() {
        super(`User onboarding not completed`);
        this.name = 'NotCompletedOnboardingError';
    }
} 

export class UserRegistrationError extends DomainError {
    constructor() {
        super('User already exists');
        this.name = 'UserRegistrationError';
    }
}

export class NotFoundReferralCodeError extends Error {
    constructor() {
        super('Referral code not found');
        this.name = 'NotFoundReferralCodeError';
    }
}