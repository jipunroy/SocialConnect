import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Join SocialConnect and start making a difference."
    >
      <RegisterForm />
    </AuthLayout>
  );
}