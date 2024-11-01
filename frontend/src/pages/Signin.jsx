import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputBox } from "../components/InputBox";
import { Heading } from "../components/Heading";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import axios from "axios";

const  Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"USER SIGN IN"}/>
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} placeholder={"Email / username"}/>
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} placeholder={"Password"} />
                <div className="pt-4">
                    <Button label={"Sign in"} onClick={ async () => {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                            username,
                            password
                        });
                        localStorage.setItem("token", response.data.token)
                        navigate("/dashboard");
                    }} />
                </div>
                <div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"sign up"} to={"/signup"}/>
                </div>
            </div>
        </div> 
    </div>
}

export default Signin;