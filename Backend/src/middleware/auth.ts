import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: "reachinbox-5f292",
      private_key_id: "7f4f6c69efd203a66ef38f79e4babd9723c35f55",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDo+lRaQChIVmtr\njFwdup0f62yDgGwSnW4GvAeUJNaZpBd8v22cxsYTBPl2G8Nri+cIR02FWVA7qdt5\naa05s/RzARUxETIO0aEI8w7/WasgpfegU1GU7kbujzyaiF+6wBJkYTk9uRwcueug\nWmJATjWFzW1WDycpCX6H4QasrlglMUct/P5a2SMCcL850DdZHPr3aCEpsBxChWh6\n1DocrG2OWbNzqGECh6mhIvqIixywaC15wkC/RlsXBbBtGCCEPzIPJu4Sw7TnLoyJ\nDHgtqGEcsq7w75DV6LJPOSmxqo3LV83ax6MxtxlGoLQ/GFSeMKVzhfVMKmifmdn0\nN4Ur053dAgMBAAECggEAXIdjbg6yEPzFoAq4YRRHKDC7wcSE56W/14vhJKy20IFz\n1JdApPXrIA2nOAnRxMplIQwUlUQCEhglcySN6G94xB4nePvf2jPWlbPW/oJx7T8N\nSI8exRwXbtLTmnpULtru0xAsCEAXEq+ijeanw+tr5W7PoFDXWDyNlNDB8l4x4t7b\nt7H582xMW4InVkgMZg1F23284Wfu5/PzSZB+od48AUsUKoYjOQquWJ106O+6DG+Q\n/6l2coECy8c2N4GW7lsiHzFsbMUSNILGIatAJhTNaN1+tlgNPIE4HBXrRJQwbzX/\nkjCbUCEz8W/pBbibm1rFhsZ0TJQuOe+wJa7rstymLwKBgQD/3lH5NeRqfVZltwKZ\naL3oV5LewxIGFXKBB180YBbIdYhm+vyIanhbcOTuQjqfpUkIEYFd6b6erL42nKjv\nVjDy81QJttk0ABBu8AIezT0Euj4OI/jfxSuIulueOQ57g24sh1K+N2dJMRZolwcM\nR5a6OGwSi9F6B1vpdre4jPvLIwKBgQDpGP8ITC6PUksUnWOrJZlGQysLdYPZAtFM\nwBJn9sCT2vKEoV33l+N8KniQMVHILd5wmfEwYGLslgHXaQ6ATRSozmT1/fGp9vUs\nqonpKV8MDXMLOxUx/eeUzcIB2EOVGii8b3OFus3680Kt/oOlIqluMDpx7K95sfof\nqrd3+roC/wKBgQCJjVtEPlStavQneltLXaO6ZFnwp63o117XPr9PyNh2q7jIo+Ve\n8N4DSo3ICJK7gH/idoa1lhOD+hnIAjBPemaWNXnYPxRFgENVYHHDXVKQWA9EStJg\nef8NYiIezU2b2OxBw/4XhHFiR6FkWMzRLSs6sVpoHgJfN9WRjOD3tdMnQQKBgHrf\n3ViPaB/O/psQWIDYohKix6cTvHwB+zjdKxa4wU1vplX6BmHFJHrInKNODFFctJxg\n2f5pYNxcOv5FeAp0F4bgveHairDQ6O8xut85Gsxsro9mBsdCk/gh+rokOYP4tS6Y\nBaqiDYDTCPxVZSoAupXGQJjbbqjVBAf7YxmRBssbAoGBAI2N0AckPuNE0jXsr+1S\nJQuUABz9yn4Ab5exAPTyRNlqaUCi54QAe28V6eshyHjpYLxQwUSDClc3NcpU8JmK\nIP18nif4/nNnhRNTODuMQfzn0U2ameJnpKglc+5hYDTe/c2vz9kuj4ehBjBI2vzR\n1yuOZ0IJLzV+N8SQvAMw0p74\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@reachinbox-5f292.iam.gserviceaccount.com",
      client_id: "102136055680331160775",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40reachinbox-5f292.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}