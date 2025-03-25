"use client"

import Image from "next/image"
import Link from "next/link"
import { BarChart3, FileText, Lock, Menu, X, Zap, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary dark:text-primary-foreground">DealSync</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-sm font-medium text-foreground hover:text-secondary">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-foreground hover:text-secondary">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-foreground hover:text-secondary">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground hover:text-secondary">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium text-foreground hover:text-secondary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-primary dark:text-primary-foreground sm:text-5xl xl:text-6xl/none">
                    Synchronize Your Financial Deals
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Integrate all your financial negotiations and cash flow management in one seamless platform
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#contact"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="DealSync Dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 dark:bg-muted/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-white">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter text-primary dark:text-primary-foreground sm:text-5xl">
                  Powerful Financial Tools
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  DealSync provides everything you need to manage your financial operations efficiently and securely.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-card text-card-foreground">
                <div className="rounded-full bg-secondary/10 p-4">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Real-time Cash Flow</h3>
                <p className="text-center text-muted-foreground">
                  Monitor your cash flow in real-time with intuitive dashboards and reports.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-card text-card-foreground">
                <div className="rounded-full bg-secondary/10 p-4">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Automated Invoicing</h3>
                <p className="text-center text-muted-foreground">
                  Automatically generate and send invoices and boletos to your clients.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-card text-card-foreground">
                <div className="rounded-full bg-secondary/10 p-4">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Integrated Reporting</h3>
                <p className="text-center text-muted-foreground">
                  Generate comprehensive financial reports with just a few clicks.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-card text-card-foreground">
                <div className="rounded-full bg-secondary/10 p-4">
                  <Lock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Secure Data Sync</h3>
                <p className="text-center text-muted-foreground">
                  Keep your financial data secure and synchronized across all devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-white">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter text-primary dark:text-primary-foreground sm:text-5xl">
                  Trusted by Businesses
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about DealSync.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-card text-card-foreground">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "DealSync has transformed how we manage our finances. The real-time cash flow monitoring has been a
                    game-changer for our business."
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="rounded-full bg-muted p-1">
                    <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">CFO, TechCorp</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-card text-card-foreground">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "The automated invoicing feature has saved us countless hours each month. Our team can now focus on
                    more strategic tasks."
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="rounded-full bg-muted p-1">
                    <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Carlos Mendes</p>
                    <p className="text-sm text-muted-foreground">Finance Director, GlobalTrade</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-card text-card-foreground">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "DealSync's integrated reporting has given us insights we never had before. It's like having a
                    financial analyst on staff 24/7."
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="rounded-full bg-muted p-1">
                    <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">CEO, InnovateBiz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Synchronize Your Financial Deals?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Request a demo today and see how DealSync can transform your financial operations.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="grid gap-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button type="submit" className="w-full bg-secondary text-white hover:bg-secondary/90">
                  Request Demo
                </Button>
              </form>
              <p className="text-xs text-primary-foreground/80">
                By submitting this form, you agree to our{" "}
                <Link href="#" className="underline underline-offset-2 hover:text-primary-foreground">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary dark:text-primary-foreground">DealSync</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DealSync. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Use
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-secondary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-secondary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-secondary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-secondary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-md animate-in slide-in-from-top-1">
          <div className="flex flex-col space-y-4">
            <Link
              href="#"
              className="text-lg font-medium text-foreground hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-lg font-medium text-foreground hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-lg font-medium text-foreground hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-lg font-medium text-foreground hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-lg font-medium text-foreground hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

