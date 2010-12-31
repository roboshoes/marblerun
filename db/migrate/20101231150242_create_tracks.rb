class CreateTracks < ActiveRecord::Migration
  def self.up
    create_table :tracks do |t|
      t.text :json
      t.string :username
      t.string :trackname
      t.integer :likes
      t.integer :blames
      t.boolean :active
      t.float :length

      t.timestamps
    end
  end

  def self.down
    drop_table :tracks
  end
end
