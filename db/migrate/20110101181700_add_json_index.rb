class AddJsonIndex < ActiveRecord::Migration
  def self.up
    add_index :tracks, :json, { :name => 'json_index', :unique => true }
  end

  def self.down
    remove_index :tracks, :json_index
  end
end
