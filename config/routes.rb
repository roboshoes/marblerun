Marblerun::Application.routes.draw do

  resources :tracks, :only => [:index, :create, :new, :show, :update]

  controller :pages do
    match 'about' => :about
    match 'imprint' => :imprint
    match 'contact' => :contact
    match 'help' => :help
  end
end
