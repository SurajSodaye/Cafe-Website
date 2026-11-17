import React from "react";
import { Link } from "react-router-dom";
import { Coffee, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-espresso/5 flex items-center justify-center text-espresso/40">
        <Coffee className="w-8 h-8 text-terracotta" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-espresso">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-espresso/60 max-w-md">
        The administration screen you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/dashboard">
          <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
