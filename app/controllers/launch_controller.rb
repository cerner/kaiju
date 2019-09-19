class LaunchController < ApplicationController
  include ::SessionsHelper

  def show
    @props = Kaiju::UserJson.to_json(current_user.id, request.base_url)
  end
end
