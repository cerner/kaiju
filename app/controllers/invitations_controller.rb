class InvitationsController < ApplicationController
  include ::InvitationsHelper
  before_action :fetch_invitation

  def show
    # Rails.logger.debug params
    redirect_to URI.parse(accept_invitation(params[:invitation_object])).path
  end

  def fetch_invitation
    invitation = Kaiju::Invitation.by_id(params[:id])
    not_found unless invitation
    params[:invitation_object] = invitation
  end
end
