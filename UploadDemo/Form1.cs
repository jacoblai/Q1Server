using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UploadDemo
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void bt_post_Click(object sender, EventArgs e)
        {
            if (tb_key.Text != string.Empty && tb_url.Text != string.Empty)
            {
                byte[] array;
                string filename;

                using (OpenFileDialog openFileDialog1 = new OpenFileDialog())
                {
                    if (openFileDialog1.ShowDialog() != DialogResult.OK)
                        return;
                    tb_url.Text = "http://localhost:8080/api/upload/" + Path.GetFileName(openFileDialog1.FileName);
                    filename = openFileDialog1.FileName;
                    array = File.ReadAllBytes(filename);
                }
                post(array);
            }
        }

        void post(byte[] byteArray)
        {
            try
            {
                WebRequest request = WebRequest.Create(tb_url.Text);
                request.Timeout = (int)TimeSpan.FromDays(1).TotalMilliseconds;
                request.Method = "POST";
                request.Headers.Add("U-ApiKey", tb_key.Text);
                request.ContentType = "application/octet-stream";
                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
                WebResponse response = request.GetResponse();
                lb_msg.Items.Insert(0, ((HttpWebResponse)response).StatusDescription);
                dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                lb_msg.Items.Insert(0, responseFromServer);
                reader.Close();
                dataStream.Close();
                response.Close();
            }
            catch (Exception ex)
            {
                lb_msg.Items.Insert(0, ex.Message);
            }

        }

    }
}
