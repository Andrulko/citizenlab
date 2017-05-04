class User < ApplicationRecord
  has_secure_password validations: false
  mount_base64_uploader :avatar, AvatarUploader

  has_many :ideas, foreign_key: :author_id

  validates :email, :slug, uniqueness: true
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }
  validates :first_name, :last_name, :slug, :email, presence: true
  validates :locale, presence: true, inclusion: { in: proc {Tenant.settings('core','locales')} }

  ROLES_JSON_SCHEMA = Rails.root.join('config', 'schemas', 'user_roles.json_schema').to_s
  validates :roles, json: { schema: ROLES_JSON_SCHEMA, message: ->(errors) { errors } }

  before_validation :generate_slug
  # For prepend: true, see https://github.com/carrierwaveuploader/carrierwave/wiki/Known-Issues#activerecord-callback-ordering
  before_save :generate_avatar, on: :create, prepend: true

  def avatar_blank?
    avatar.file.nil?
  end

  def display_name
    [first_name, last_name].join(" ")
  end

  def admin?
    !!self.roles.find{|r| r["type"] == "admin"}
  end

  def lab_moderator? lab_id
    !!self.roles.find{|r| r["type"] == "lab_moderator" && r["lab_id"] == lab_id}
  end
  
  private

  def generate_slug
    unless self.slug
      slug = [self.first_name.parameterize, self.last_name.parameterize].join('-')
      indexedSlug = nil
      i=0
      while User.find_by(slug: indexedSlug || slug)
        i +=1
        indexedSlug = [slug, '-', i].join
      end
      self.slug = indexedSlug || slug
    end
  end

  def generate_avatar
    unless self.avatar?
      hash = Digest::MD5.hexdigest(self.email)
      self.remote_avatar_url = "https://www.gravatar.com/avatar/#{hash}?d=retro&size=640"
    end
  end

end
