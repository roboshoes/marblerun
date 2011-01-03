class CreateUnlocks < ActiveRecord::Migration
  def self.up
    create_table :unlocks do |t|
      t.integer :minimum_length
      t.string :brick_type
      t.boolean :is_unlocked

      t.timestamps
    end
  end

  def self.down
    drop_table :unlocks
  end
end
