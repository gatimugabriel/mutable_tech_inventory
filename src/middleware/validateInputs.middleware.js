import { check, validationResult } from "express-validator";

const signupInputs = [
    check("userName", "userName is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("role", "role is required").not().isEmpty(),
]

const passwordInput = [
    check("password", "Password is required")
        .not().isEmpty()
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .isStrongPassword()
        .withMessage(
            "Password should have both uppercase and lowercase letters, numbers, and special characters"
        ),
];

const productInputs = [
    check("attributes", "Attributes are required").isArray({ min: 1 }).withMessage("At least one attribute is required"),
]

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};


export default { signupInputs, passwordInput, productInputs, validate }
