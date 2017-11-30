require 'rails_helper'

module Kaiju
  describe InvitationJson do
    context 'as_json' do
      it 'returns json for an invitation' do
        project_id = 'project_id'
        workspace_id = 'workspace_id'
        inviter_id = 'inviter_id'
        base_url = 'base_url'
        invitation = InvitationFactory.new_workspace_invitation(project_id, workspace_id, inviter_id)

        expect(InvitationJson.as_json(invitation.id, base_url)).to eq(
          'url' => base_url + '/invitations/' + invitation.id
        )

        invitation.destroy
      end
    end
  end
end
