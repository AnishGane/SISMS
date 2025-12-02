1. admin auth api : auth/admin
   login admin api - auth/admin/login
   register admin api - auth/admin/register
   login staff api - auth/staff/login

2. I have forgot password link that redirects to the auth/admin/forgot-password page for admin and for staff: auth/staff/forgot-password, make the ForgotPassword.tsx code that takes email from the user input and has cta button send otp then i have otp code:
   ```
   VerifyOTP.tsx:
   import { useState } from "react";


const VerifyOTP = () => {
const [otp, setOtp] = useState(["", "", "", ""]);

const handleChange = (value: string, index: number) => {
if (isNaN(Number(value))) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
if (e.key === "Backspace" && !otp[index] && index > 0) {
const prev = document.getElementById(`otp-${index - 1}`);
prev?.focus();
}
};

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
<div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8">
<h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>
<p className="text-gray-500 text-center mb-6">
Enter the 4-digit code sent to your email
</p>

        {/* OTP Input Boxes */}
        <div className="flex items-center justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          className="w-full mt-8 bg-blue-600 text-white py-2 rounded-lg font-medium
                     hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 font-medium cursor-pointer">Resend</span>
        </p>
      </div>
    </div>

);
};

export default VerifyOTP;

```

3. make the use of react-email and resend for the email functionality that sent the otp and link to verify otp page so that user enters otp that otp is send by the help of backend make the backend api endpoints and all the logic need for that.
4. make no mistake and make it precise and error free
```


api/auth/admin/forgot-password
api/auth/staff/forgot-password - backend api
