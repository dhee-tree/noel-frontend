"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField, TextAreaField } from "@/components/forms";
import { useApiRequest } from "@/hooks/useApiRequest";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import {
  FaEnvelope,
  FaPaperPlane,
  FaQuestionCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./ContactPage.module.css";
import Link from "next/link";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof ContactSchema>;

export default function ContactClientPage() {
  const { apiRequest } = useApiRequest();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setApiError(null);
    try {
      const res = await apiRequest("/api/contact/", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong. Please try again later.");
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.infoSection}>
          <h1 className={styles.title}>
            Get in <span className={styles.highlight}>Touch</span>
          </h1>
          <p className={styles.subtitle}>
            Have a question about your Secret Santa group? Found a bug? Or just
            want to say Merry Christmas? We&apos;d love to hear from you.
          </p>

          <div className={styles.contactMethods}>
            <div className={styles.method}>
              <div className={styles.iconWrapper}>
                <FaEnvelope />
              </div>
              <div className={styles.methodContent}>
                <h4>Email Us</h4>
                <Link
                  href="mailto:support@noelsecretsanta.com"
                  className={styles.link}
                >
                  support@noelsecretsanta.com
                </Link>
              </div>
            </div>

            <div className={styles.method}>
              <div className={styles.iconWrapper}>
                <FaQuestionCircle />
              </div>
              <div className={styles.methodContent}>
                <h4>Help Center</h4>
                <p>
                  Check out our{" "}
                  <Link href="/#faq" className={styles.link}>
                    FAQ
                  </Link>{" "}
                  for quick answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          {isSubmitted ? (
            <div className={styles.successState}>
              <FaCheckCircle className={styles.successIcon} />
              <h2 className={styles.successTitle}>Message Sent!</h2>
              <p className={styles.successText}>
                Thanks for reaching out. Our elves will get back to you shortly.
              </p>
              <Button
                variant="outline-dark"
                className="mt-3"
                onClick={() => setIsSubmitted(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <InputField
                  name="name"
                  label="Your Name"
                  register={register}
                  error={errors.name}
                  placeholder="Santa Claus"
                />
              </div>

              <div className="mb-3">
                <InputField
                  name="email"
                  label="Email Address"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="santa@northpole.com"
                />
              </div>

              <div className="mb-3">
                <InputField
                  name="subject"
                  label="Subject"
                  register={register}
                  error={errors.subject}
                  placeholder="How do I..."
                />
              </div>

              <div className="mb-4">
                <TextAreaField
                  name="message"
                  label="Message"
                  register={register}
                  error={errors.message}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                />
              </div>

              {apiError && (
                <Alert variant="danger" className="mb-3">
                  {apiError}
                </Alert>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={14} /> Send Message
                  </>
                )}
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
