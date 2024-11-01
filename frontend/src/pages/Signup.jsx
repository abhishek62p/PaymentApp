import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("")
        setFieldErrors({});

        const newFieldErrors = {};
        if (!username) newFieldErrors.username = "username are required";
        if (!firstName) newFieldErrors.firstName = "first name are required";
        if (!lastName) newFieldErrors.lastName = "last name are required";
        if (!password) newFieldErrors.password = "passwords are required";

        if(Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username,
                firstName,
                lastName,
                password
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            setError("Signup failed Please try again");
            console.log(error);
        }
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white px-7 w-80 text-center p-2 h-max px-4 shadow-lg">
                <Heading label={"USER SIGN UP"} />
                <InputBox onChange={e => {
                    setFirstName(e.target.value);
                }} placeholder={"First Name"} label={"First Name"} className={`border ${fieldErrors.firstName ? "border-red-500" : "border-gray-300"} rounded`} />
                {fieldErrors.firstName && <p className="text-red-500 text-xl">{fieldErrors.firstName}</p>}
                <InputBox onChange={e => {
                    setLastName(e.target.value);
                }} placeholder="Last Name" label={"Last Name"} />
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} placeholder="Email / username" label={"Email"} />
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} placeholder="Password" label={"password"} />
                <div className="pt-4">
                    <Button onClick={handleSubmit} label={"Sign up"} />
                    <div>
                        <BottomWarning label={"Already have an account?"} buttonText={"sign in"} to={"/signin"} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Signup;