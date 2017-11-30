
# Public: A Invitation model
module Kaiju
  class Invitation
    include Redis::Objects
    include Kaiju::BaseModel

    attr_reader :id

    value :creation_date_time

    value :project_id

    value :workspace_id

    # the user who created the invitaion
    value :inviter_id

    value :inactive, marshal: true

    def initialize(id)
      @id = id
    end

    def as_json(_options = {})
      json_representation
    end

    def destroy
      delete!
    end
  end
end
