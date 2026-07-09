import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
} from "lucide-react";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Hooks MUST come before any return
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setBio(user.bio || "");
    setLocation((user as any).location || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await updateProfile((user as any)._id || user.id, {
        name,
        bio,
        location,
        avatarUrl,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setBio(user.bio || "");
    setLocation((user as any).location || "");
    setAvatarUrl(user.avatarUrl || "");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
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

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>

                  <p className="mt-2 text-sm text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  value={user.email}
                  disabled
                />

                <Input
                  label="Role"
                  value={user.role}
                  disabled
                />

                <Input
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <Input
                  label="Avatar URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>

                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

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
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Security Settings
              </h2>
            </CardHeader>

            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>

                    <Badge variant="error" className="mt-1">
                      Not Enabled
                    </Badge>
                  </div>

                  <Button variant="outline">
                    Enable
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                  />

                  <Input
                    label="New Password"
                    type="password"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                  />

                  <div className="flex justify-end">
                    <Button>
                      Update Password
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