import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardBody,
} from "../../components/ui/Card";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const {
    user,
    updateProfile,
    updateEmail,
    updatePassword,
  } = useAuth();

  /* ==================================================
      PROFILE
  ================================================== */

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  /* ==================================================
      EMAIL
  ================================================== */

  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] =
    useState("");

  /* ==================================================
      PASSWORD
  ================================================== */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  /* ==================================================
      LOADING
  ================================================== */

  const [isSaving, setIsSaving] =
    useState(false);

  const [isUpdatingEmail, setIsUpdatingEmail] =
    useState(false);

  const [
    isUpdatingPassword,
    setIsUpdatingPassword,
  ] = useState(false);

  /* ==================================================
      SUCCESS MESSAGES
  ================================================== */

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [emailSuccess, setEmailSuccess] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  /* ==================================================
      ERROR MESSAGES
  ================================================== */

  const [profileError, setProfileError] =
    useState("");

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  /* ==================================================
      LOAD USER
  ================================================== */

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setBio(user.bio || "");
    setLocation(user.location || "");
    setAvatarUrl(user.avatarUrl || "");
    setEmail(user.email);

    setEmailPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setProfileSuccess("");
    setEmailSuccess("");
    setPasswordSuccess("");

    setProfileError("");
    setEmailError("");
    setPasswordError("");
  }, [user]);

  if (!user) return null;

  /* ==================================================
      PROFILE
  ================================================== */

  const handleSave = async () => {
    setProfileSuccess("");
    setProfileError("");

    try {
      setIsSaving(true);

      await updateProfile(
        (user as any)._id || user.id,
        {
          name,
          bio,
          location,
          avatarUrl,
        }
      );

      setProfileSuccess(
        "Profile updated successfully."
      );
    } catch (err: any) {
      setProfileError(
        err?.message || "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setBio(user.bio || "");
    setLocation(user.location || "");
    setAvatarUrl(user.avatarUrl || "");

    setProfileError("");
    setProfileSuccess("");
  };

  /* ==================================================
      EMAIL
  ================================================== */

  const handleEmailUpdate = async () => {
    setEmailSuccess("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email cannot be empty.");
      return;
    }

    if (!emailPassword.trim()) {
      setEmailError(
        "Please enter your current password."
      );
      return;
    }

    try {
      setIsUpdatingEmail(true);

      await updateEmail(
        emailPassword,
        email
      );

      setEmailPassword("");

      setEmailSuccess(
        "Email updated successfully."
      );
    } catch (err: any) {
      setEmailError(
        err?.message ||
          "Unable to update email."
      );
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  /* ==================================================
      PASSWORD
  ================================================== */

  const handlePasswordUpdate = async () => {
    setPasswordSuccess("");
    setPasswordError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "Passwords do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setIsUpdatingPassword(true);

      await updatePassword(
        currentPassword,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(
        "Password updated successfully."
      );
    } catch (err: any) {
      setPasswordError(
        err?.message ||
          "Unable to update password."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Settings
      </h1>

      <p className="text-gray-600">
        Manage your account preferences and settings
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* ==========================
          SIDEBAR
      ========================== */}

      <Card className="lg:col-span-1">
        <CardBody className="p-2">
          <nav className="space-y-1">

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md">
              <User size={18} className="mr-3" />
              Profile
            </button>

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Lock size={18} className="mr-3" />
              Security
            </button>

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Bell size={18} className="mr-3" />
              Notifications
            </button>

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Globe size={18} className="mr-3" />
              Language
            </button>

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Palette size={18} className="mr-3" />
              Appearance
            </button>

            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <CreditCard size={18} className="mr-3" />
              Billing
            </button>

          </nav>
        </CardBody>
      </Card>

      {/* ==========================
          MAIN CONTENT
      ========================== */}

      <div className="lg:col-span-3 space-y-6">

        {/* ==========================
            PROFILE SETTINGS
        ========================== */}

        <Card>

          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">
              Profile Settings
            </h2>
          </CardHeader>

          <CardBody className="space-y-6">

            <div className="flex items-center gap-6">

              <Avatar
                src={avatarUrl}
                alt={name}
                size="xl"
              />

              <div>

                <Button
                  variant="outline"
                  size="sm"
                >
                  Change Photo
                </Button>

                <p className="mt-2 text-sm text-gray-500">
                  JPG, GIF or PNG. Max size of 800KB
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setProfileError("");
                  setProfileSuccess("");
                }}
              />

              <Input
                label="Role"
                value={user.role}
                disabled
              />

              <Input
                label="Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setProfileError("");
                  setProfileSuccess("");
                }}
              />

              <Input
                label="Avatar URL"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setProfileError("");
                  setProfileSuccess("");
                }}
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>

              <textarea
                rows={4}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setProfileError("");
                  setProfileSuccess("");
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />

            </div>

            {profileError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">
                  {profileError}
                </p>
              </div>
            )}

            {profileSuccess && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">
                  {profileSuccess}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

            </div>

          </CardBody>

        </Card>

        {/* ==========================
            SECURITY SETTINGS
        ========================== */}

        <Card>

          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">
              Security Settings
            </h2>
          </CardHeader>

          <CardBody className="space-y-8">

            {/* TWO FACTOR */}

            <div>

              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Two-Factor Authentication
              </h3>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account.
                  </p>

                  <Badge
                    variant="error"
                    className="mt-1"
                  >
                    Not Enabled
                  </Badge>

                </div>

                <Button variant="outline">
                  Enable
                </Button>

              </div>

            </div>

                          {/* ==========================
                  CHANGE EMAIL
              ========================== */}

              <div className="border-t pt-6">

                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Change Email
                </h3>

                <div className="space-y-4">

                  <Input
                    label="New Email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setEmailSuccess("");
                    }}
                  />

                  <Input
                    label="Current Password"
                    type="password"
                    autoComplete="current-password"
                    value={emailPassword}
                    onChange={(e) => {
                      setEmailPassword(e.target.value);
                      setEmailError("");
                      setEmailSuccess("");
                    }}
                  />

                  {emailError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm text-red-700">
                        {emailError}
                      </p>
                    </div>
                  )}

                  {emailSuccess && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                      <p className="text-sm text-green-700">
                        {emailSuccess}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">

                    <Button
                      onClick={handleEmailUpdate}
                      disabled={isUpdatingEmail}
                    >
                      {isUpdatingEmail
                        ? "Updating..."
                        : "Update Email"}
                    </Button>

                  </div>

                </div>

              </div>

              {/* ==========================
                  CHANGE PASSWORD
              ========================== */}

              <div className="border-t pt-6">

                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4">

                  <Input
                    label="Current Password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                  />

                  {passwordError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm text-red-700">
                        {passwordError}
                      </p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                      <p className="text-sm text-green-700">
                        {passwordSuccess}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">

                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword
                        ? "Updating..."
                        : "Update Password"}
                    </Button>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

    </div>
  );
};