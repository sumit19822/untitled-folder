require 'webrick'

root = File.expand_path(__dir__)
server = WEBrick::HTTPServer.new(
  Port: 8080,
  DocumentRoot: root,
  BindAddress: '127.0.0.1'
)

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "Dairy App Server running on http://localhost:8080"
server.start
