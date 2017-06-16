provider "aws" {
  region = "eu-west-1"
}

data "template_file" "bomb_bootstrap" {
  template = "${file("bomb/boot.tlp")}"

}

data "template_file" "spy_bootstrap" {
  template = "${file("spy/boot.tlp")}"
  vars = {
    bomb_url="${aws_instance.bomb.private_ip}"
  }

}


resource "aws_instance" "bomb" {
  ami                   = "ami-d41d58a7"
  instance_type         = "t2.micro"
  key_name              = "gateway"
  user_data             = "${data.template_file.bomb_bootstrap.rendered}"
  tags {
    Name = "theo-game-bomb"
    Owner = "theo.mccaie"
    EndOfLife = "2017-07-30"
  }
}

resource "aws_instance" "spy" {
  ami                   = "ami-d41d58a7"
  instance_type         = "t2.micro"
  key_name              = "gateway"
  user_data             = "${data.template_file.spy_bootstrap.rendered}"
  tags {
    Name = "theo-game-spy"
    Owner = "theo.mccaie"
    EndOfLife = "2017-07-30"
  }
}
