require 'id_generator'

module Kaiju
  class InvitationFactory
    def self.new_project_invitation(project_id, inviter_id)
      invitation = new_invitation(inviter_id)
      invitation.project_id = project_id
      invitation
    end

    def self.new_workspace_invitation(project_id, workspace_id, inviter_id)
      invitation = new_project_invitation(project_id, inviter_id)
      invitation.workspace_id = workspace_id
      invitation
    end

    def self.new_invitation(inviter_id)
      invitation = Invitation.new(IdGenerator.generate_id)
      invitation.creation_date_time = DateTime.now.iso8601_precise
      invitation.inviter_id = inviter_id
      invitation.expire(1.day)
      invitation
    end
  end
end
