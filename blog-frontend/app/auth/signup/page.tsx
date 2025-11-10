"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { signupUser, verifyOtp, resendOtp } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner"

export default function SignupFormDemo() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [openOtpDialog, setOpenOtpDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // local toast for validation
      toast.error("Passwords do not match");
      return;
    }

    const res = await dispatch(
      signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );

    if (signupUser.fulfilled.match(res)) {
      // OTP sent successfully — open OTP dialog
      setOpenOtpDialog(true);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.email) return;
    await dispatch(resendOtp({ email: formData.email }));
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    const res = await dispatch(verifyOtp({ email: formData.email, otp }));
    if (verifyOtp.fulfilled.match(res)) {
      toast.success("OTP verified successfully!", {
        action: {
          label: "Login Now",
          onClick: () => router.push("/login")
        }
      });
      setOpenOtpDialog(false);
    }
  };

  return (
    <>
      {/* Signup Form */}
      <div className="shadow-input my-36 mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
          Sign Up
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Tyler123"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <button
            type="submit"
            disabled={loading}
            className="group/btn relative mt-4 block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md dark:from-zinc-800 dark:to-zinc-900"
          >
            {loading ? "Creating Account..." : "Sign up →"}
            <BottomGradient />
          </button>
        </form>
      </div>

      {/* OTP Dialog */}
      <Dialog open={openOtpDialog} onOpenChange={setOpenOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">
              Enter the 6-digit OTP sent to your email
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <button
            onClick={handleOtpVerify}
            disabled={loading}
            className="mt-6 w-1/2 mx-auto rounded-md dark:bg-white bg-black dark:text-black text-white py-2 font-medium "
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => handleResendOtp()}
            disabled={loading}
            className="mt-4 w-full text-sm hover:text-blue-600 disabled:opacity-50"
          >
            Didn’t receive the OTP? Resend
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2 mb-4", className)}>
    {children}
  </div>
);
