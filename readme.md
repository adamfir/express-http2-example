# Generate Certificate

## SELF SIGN CERT
```
openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj -keyout localhost-private.pem -out localhost-cert.pem
```

## CERTBOT / Let's Encrypt
```
sudo certbot certonly --standalone
```