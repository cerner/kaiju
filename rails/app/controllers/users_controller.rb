class UsersController < ApplicationController
  include Kaiju

  def show
    Rails.logger.debug params

    user_id = params['id']

    not_found unless User.exists?(user_id)

    render json: Kaiju::UserJson.to_json(user_id, request.base_url)
  end

  def index
    Rails.logger.debug params

    render json: Kaiju::UserJson.users_to_json(request.base_url)
  end

  def reset_changelog
    User.ids.each { |id| User.by_id(id).changelog_viewed = false }
    head :ok
  end
end
