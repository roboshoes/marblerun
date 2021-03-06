{
  pkgs ? import (fetchGit {
    url = https://github.com/NixOS/nixpkgs-channels;
    ref = "3590ff2d4c64711a194e3f18fc5c140e7dfa25df";
  }) {},
  ruby ? pkgs.ruby_2_3,
  bundler ? pkgs.bundler.override { inherit ruby; }

}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    ruby
    bundler
  ];
  shellHook = ''
    chruby_reset

    mkdir -p .nix-gems
    export GEM_HOME=$PWD/.nix-gems
    export GEM_PATH=$GEM_HOME
  '';
}
