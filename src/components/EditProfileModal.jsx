import React, { useState, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, userProfile, onSave }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    bio: userProfile?.bio || ''
  });
  const [avatarImage, setAvatarImage] = useState(null);

  // 当弹窗打开或用户资料更新时，重置表单数据
  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({
        name: userProfile.name || '',
        bio: userProfile.bio || ''
      });
      // 如果当前头像是图片（base64 或 URL），则设置为预览
      const isImageAvatar = typeof userProfile.avatar === 'string' && (userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http'));
      setAvatarImage(isImageAvatar ? userProfile.avatar : null);
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedProfile = {
      ...userProfile,
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      avatar: avatarImage || userProfile?.avatar || ''
    };
    onSave(updatedProfile);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 头像编辑 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">Avatar</label>
            <div className="flex items-center gap-4">
              {/* 头像预览 */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl overflow-hidden">
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-white/70" />
                )}
              </div>

              {/* 图片上传 */}
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={16} className="text-slate-600" />
                  <span className="text-slate-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {avatarImage && (
                  <button
                    onClick={() => setAvatarImage(null)}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 昵称编辑 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              maxLength={50}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* 签名编辑 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              maxLength={200}
              rows={4}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-slate-400 text-right">
              {formData.bio.length}/200
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim()}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

