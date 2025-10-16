# BaseModal Component

A reusable modal component that provides consistent styling and behavior across the application.

## Features

- 🎨 **Consistent Design**: Christmas-themed header with gradient
- 🔄 **Loading States**: Built-in loading spinner support for buttons
- 📱 **Responsive**: Mobile-friendly with full-width buttons on small screens
- ⚙️ **Configurable**: Flexible props for different use cases
- ♿ **Accessible**: Proper ARIA attributes and keyboard support

## Usage

### Basic Example

```tsx
import { BaseModal } from "@/components/modals/BaseModal/BaseModal";

<BaseModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="My Modal"
  footerButtons={[
    {
      label: "Cancel",
      variant: "secondary",
      onClick: () => setShowModal(false),
    },
    {
      label: "Submit",
      variant: "primary",
      onClick: handleSubmit,
    },
  ]}
>
  <p>Your modal content here...</p>
</BaseModal>
```

### With Loading State

```tsx
<BaseModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Processing..."
  footerButtons={[
    {
      label: "Cancel",
      variant: "secondary",
      onClick: handleCancel,
      disabled: loading,
    },
    {
      label: "Save",
      variant: "primary",
      onClick: handleSave,
      loading: loading, // Shows spinner and "Save..." text
      disabled: loading,
    },
  ]}
>
  <Form>
    {/* Your form fields */}
  </Form>
</BaseModal>
```

### Form Submission

```tsx
const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();
  // Your submit logic
};

<BaseModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Create New Item"
  footerButtons={[
    {
      label: "Cancel",
      variant: "secondary",
      onClick: () => setShowModal(false),
    },
    {
      label: "Create",
      variant: "primary",
      type: "submit", // Makes button submit the form
      onClick: handleSubmit,
      disabled: !isValid,
    },
  ]}
>
  <Form onSubmit={handleSubmit}>
    {/* Form fields */}
  </Form>
</BaseModal>
```

## Props

### BaseModalProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | - | **Required**. Controls modal visibility |
| `onHide` | `() => void` | - | **Required**. Called when modal should close |
| `title` | `string` | - | **Required**. Modal title shown in header |
| `children` | `ReactNode` | - | **Required**. Modal body content |
| `size` | `"sm" \| "lg" \| "xl"` | `undefined` | Modal size |
| `centered` | `boolean` | `true` | Vertically center modal |
| `closeButton` | `boolean` | `true` | Show close button in header |
| `footerButtons` | `BaseModalButton[]` | `undefined` | Array of footer buttons |
| `backdrop` | `"static" \| true \| false` | `true` | Backdrop behavior |
| `keyboard` | `boolean` | `true` | Close on ESC key |
| `className` | `string` | `undefined` | Additional CSS class |

### BaseModalButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | **Required**. Button text |
| `variant` | Bootstrap variant | `"primary"` | Button color variant |
| `onClick` | `() => void` | `undefined` | Click handler |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button type |

## Styling

The modal uses CSS modules for styling. To customize globally:

### Custom Colors

Edit `BaseModal.module.css`:

```css
.header {
  background: linear-gradient(135deg, #your-color 0%, #other-color 100%);
}
```

### Custom Font

The title uses the Christmas font by default:

```css
.title {
  font-family: var(--font-christmas);
}
```

## Examples

### Confirmation Dialog

```tsx
<BaseModal
  show={showConfirm}
  onHide={() => setShowConfirm(false)}
  title="Confirm Action"
  footerButtons={[
    {
      label: "Cancel",
      variant: "secondary",
      onClick: () => setShowConfirm(false),
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
    },
  ]}
>
  <p>Are you sure you want to delete this item?</p>
</BaseModal>
```

### Large Modal with Scroll

```tsx
<BaseModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Terms and Conditions"
  size="lg"
  footerButtons={[
    {
      label: "Close",
      variant: "secondary",
      onClick: () => setShowModal(false),
    },
  ]}
>
  <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
    {/* Long content */}
  </div>
</BaseModal>
```

### Static Backdrop (Can't Close by Clicking Outside)

```tsx
<BaseModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Important Notice"
  backdrop="static"
  keyboard={false}
  footerButtons={[
    {
      label: "I Understand",
      variant: "primary",
      onClick: handleAcknowledge,
    },
  ]}
>
  <p>You must acknowledge this before proceeding.</p>
</BaseModal>
```

## Migration Guide

### Before (Old Way)

```tsx
<Modal show={show} onHide={onHide} centered>
  <Modal.Header closeButton>
    <Modal.Title>My Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onHide}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
      {loading ? <Spinner size="sm" /> : "Submit"}
    </Button>
  </Modal.Footer>
</Modal>
```

### After (New Way)

```tsx
<BaseModal
  show={show}
  onHide={onHide}
  title="My Title"
  footerButtons={[
    { label: "Cancel", variant: "secondary", onClick: onHide },
    { label: "Submit", variant: "primary", onClick: handleSubmit, loading },
  ]}
>
  {/* content */}
</BaseModal>
```

## Benefits

✅ **Less Code**: Fewer lines per modal  
✅ **Consistency**: All modals look the same  
✅ **Easy Updates**: Change design in one place  
✅ **Type Safety**: Full TypeScript support  
✅ **Built-in Features**: Loading states, validation, etc.
