require 'kaiju/invitation'

module Kaiju
  class InvitationJson < ModelJson
    def self.as_json(id, base_url, _options = {})
      { 'url' => base_url + invitation_path(id) }
    end
  end
end
