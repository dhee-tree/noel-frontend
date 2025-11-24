"use client";
import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";

export type Prefs = {
  allow_marketing: boolean;
  allow_newsletter: boolean;
  allow_product_updates: boolean;
};

type Props = {
  prefs: Prefs;
  setPrefs: (next: Prefs) => void;
  onSave: () => void;
  isSaving: boolean;
};

export const EmailPreferencesForm: React.FC<Props> = ({
  prefs,
  setPrefs,
  onSave,
  isSaving,
}) => {
  return (
    <Form>
      <Form.Group className="mb-4 d-flex justify-content-between align-items-center p-3 border rounded">
        <div>
          <strong>Transactional Emails</strong>
          <div className="text-muted small">
            Important notifications, such as password reset, reminders and
            verification codes
          </div>
        </div>
        <Form.Check type="switch" checked={true} disabled />
      </Form.Group>

      <Form.Group className="mb-3 d-flex justify-content-between align-items-center p-3 border rounded">
        <div>
          <strong>Marketing & Offers</strong>
          <div className="text-muted small">
            Discounts and festive promotions
          </div>
        </div>
        <Form.Check
          type="switch"
          checked={prefs.allow_marketing}
          onChange={(e) =>
            setPrefs({ ...prefs, allow_marketing: e.target.checked })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3 d-flex justify-content-between align-items-center p-3 border rounded">
        <div>
          <strong>Newsletter</strong>
          <div className="text-muted small">Tips for a great Secret Santa</div>
        </div>
        <Form.Check
          type="switch"
          checked={prefs.allow_newsletter}
          onChange={(e) =>
            setPrefs({ ...prefs, allow_newsletter: e.target.checked })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3 d-flex justify-content-between align-items-center p-3 border rounded">
        <div>
          <strong>Product Updates</strong>
          <div className="text-muted small">New features and improvements</div>
        </div>
        <Form.Check
          type="switch"
          checked={prefs.allow_product_updates}
          onChange={(e) =>
            setPrefs({ ...prefs, allow_product_updates: e.target.checked })
          }
        />
      </Form.Group>

      <div className="text-center mt-3">
        <button
          type="button"
          className="btn btn-link text-muted text-decoration-none"
          onClick={() =>
            setPrefs({
              allow_marketing: false,
              allow_newsletter: false,
              allow_product_updates: false,
            })
          }
        >
          Unsubscribe from everything
        </button>
      </div>

      <Button
        variant="success"
        className="w-100 mt-3 fw-bold"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Spinner size="sm" animation="border" />
            {" Saving..."}
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </Form>
  );
};

export default EmailPreferencesForm;
