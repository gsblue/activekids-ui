import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { signup } from '../../store/thunks/authThunks';
import { SignUpRequest } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import { transitions, fadeIn, slideIn } from '../../utils/animations';
import { validatePassword } from '../../utils/validation';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<SignUpRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        relation: 'Mom',
    });
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setErrors(passwordErrors);
            return;
        }

        try {
            await dispatch(signup(formData)).unwrap();
            navigate('/');
        } catch (err) {
            setErrors(['Failed to create account']);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8 ${fadeIn}`}>
            <Card className={`max-w-md w-full space-y-8 ${slideIn}`}>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join FamilyPoints today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <div className={`p-3 rounded-md bg-red-50 text-red-500 text-sm ${transitions.default}`}>
                            <ul className="list-disc list-inside">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    className={`
                                        mt-1 block w-full px-3 py-2 
                                        border border-gray-300 rounded-md 
                                        shadow-sm placeholder-gray-400
                                        focus:outline-none focus:ring-primary-500 focus:border-primary-500
                                        ${transitions.default}
                                    `}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    className={`
                                        mt-1 block w-full px-3 py-2 
                                        border border-gray-300 rounded-md 
                                        shadow-sm placeholder-gray-400
                                        focus:outline-none focus:ring-primary-500 focus:border-primary-500
                                        ${transitions.default}
                                    `}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className={`
                                    mt-1 block w-full px-3 py-2 
                                    border border-gray-300 rounded-md 
                                    shadow-sm placeholder-gray-400
                                    focus:outline-none focus:ring-primary-500 focus:border-primary-500
                                    ${transitions.default}
                                `}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className={`
                                    mt-1 block w-full px-3 py-2 
                                    border border-gray-300 rounded-md 
                                    shadow-sm placeholder-gray-400
                                    focus:outline-none focus:ring-primary-500 focus:border-primary-500
                                    ${transitions.default}
                                `}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="relation" className="block text-sm font-medium text-gray-700">
                                I am a
                            </label>
                            <select
                                id="relation"
                                required
                                className={`
                                    mt-1 block w-full px-3 py-2 
                                    border border-gray-300 rounded-md 
                                    shadow-sm placeholder-gray-400
                                    focus:outline-none focus:ring-primary-500 focus:border-primary-500
                                    ${transitions.default}
                                `}
                                value={formData.relation}
                                onChange={(e) => setFormData({ ...formData, relation: e.target.value as 'Mom' | 'Dad' })}
                            >
                                <option value="Mom">Mom</option>
                                <option value="Dad">Dad</option>
                            </select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="group relative w-full"
                    >
                        Create Account
                    </Button>

                    <div className="text-sm text-center">
                        <Link 
                            to="/login" 
                            className={`
                                font-medium text-primary-600 hover:text-primary-500
                                ${transitions.default}
                            `}
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SignUp; 