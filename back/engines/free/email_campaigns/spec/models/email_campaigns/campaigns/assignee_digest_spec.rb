require 'rails_helper'

RSpec.describe EmailCampaigns::Campaigns::AssigneeDigest, type: :model do
  describe "AssigneeDigest Campaign default factory" do
    it "is valid" do
      expect(build(:assignee_digest_campaign)).to be_valid
    end
  end

  describe "apply_recipient_filters" do
    let(:campaign) { build(:assignee_digest_campaign) }

    it "filters out invitees" do
      admin = create(:admin)
      invitee = create(:invited_user, roles: [{type: 'admin'}])

      expect(campaign.apply_recipient_filters).to match([admin])
    end

    it "filters out normal users" do
      admin = create(:admin)
      moderator = create(:moderator)
      user = create(:user)

      expect(campaign.apply_recipient_filters.map(&:id)).to match_array([admin.id, moderator.id])
    end
  end
end
