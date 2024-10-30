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
    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bgwhite mu px-7 w-80 text-center p-2 h-max px-4 shadow-lg border">
                <Heading label={"USER SIGN UP"} />
                <InputBox onChange={e => {
                    setFirstName(e.target.value);
                }} placeholder={"First Name"} label={"First Name"} />
                <InputBox onChange={e => {
                    setLastName(e.target.value);
                }} placeholder="Last Name" label={"Last Name"} />
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} placeholder="Email / uaername" label={"Email"} />
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} placeholder="Password" label={"password"} />
                <div className="pt-4">
                    <Button onClick={async () => {
                        const response = await axios.post("http://localhost:3000/api/v1/user/sign", {
                            username,
                            firstName,
                            lastName,
                            password
                        });
                        localStorage.setItem("token", response.data.token)
                        navigate("/dashboard")
                    }} label={"Sign up"} />
                    <div>
                        <BottomWarning label={"Already have an account?"} buttonext={"Sign in"} to={"/signin"} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Signup;