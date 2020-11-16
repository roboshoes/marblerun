class AddDurationToTracks < ActiveRecord::Migration
  def self.up
    add_column :tracks, :duration, :integer, default: nil, null: true
  end

  def self.down
    remove_column :tracks, :duration
  end
end
