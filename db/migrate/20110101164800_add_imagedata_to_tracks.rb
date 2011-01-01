class AddImagedataToTracks < ActiveRecord::Migration
  def self.up
    add_column :tracks, :imagedata, :text
  end

  def self.down
    remove_column :tracks, :imagedata, :text
  end
end
