require 'kaiju/user'

module Kaiju
  # Public: A User model
  class UserFactory
    def self.id(uid)
      Digest::SHA256.hexdigest(uid)
    end

    def self.new_user(uid, name = nil, email = nil, nickname = nil)
      user = User.by_id(id(uid))
      if user.nil?
        user = User.new(id(uid))
        now = Time.now.iso8601_precise
        user.creation_date_time = now
      end

      user.name = name
      user.email = email
      user.nickname = nickname
      user
    end
  end
end
